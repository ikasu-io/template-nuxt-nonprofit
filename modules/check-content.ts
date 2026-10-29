// Checks every content file against its schema in schemas.ts while
// Nuxt Content reads it. Nuxt Content on its own only logs a mismatch and
// carries on, or drops the file; here a mismatch stops `npm run build`
// with the file and the field named, so a bad edit never goes live
// half-broken. `npm run dev` prints the same message and keeps running.
//
// It also tells the site which file each image name stands for, so content
// can say `image: kingfisher` whether the photo is .jpg, .png or .webp.
import { existsSync, readdirSync } from 'node:fs'
import { join, parse } from 'node:path'
import { defineNuxtModule } from 'nuxt/kit'
import { schemas } from '../schemas'

const imageFields = ['image', 'before', 'after']

// The schema for a collection. Texts have one collection per language that
// share a schema: `stories_de` uses `stories`, `org_de` uses `orgTexts`.
const schemaOf = (collection: string) => {
  const [, name, lang] = collection.match(/^(.*?)(?:_(en|de))?$/) ?? []
  const key = (lang && `${name}Texts` in schemas ? `${name}Texts` : name) as keyof typeof schemas
  return schemas[key]
}

export default defineNuxtModule({
  meta: { name: 'check-content' },
  setup(_, nuxt) {
    const imageDir = join(nuxt.options.rootDir, 'public/images')
    const imageFiles: Record<string, string> = {}
    if (existsSync(imageDir)) {
      for (const file of readdirSync(imageDir)) {
        if (/\.(jpe?g|png|webp)$/i.test(file)) imageFiles[parse(file).name] = file
      }
    }
    nuxt.options.appConfig.imageFiles = imageFiles

    nuxt.hook('content:file:afterParse' as any, (ctx: any) => {
      const schema = schemaOf(String(ctx.collection?.name))
      if (!schema) return
      // ctx.file.id is "<collection>/<path inside content/>"
      const file = `content/${String(ctx.file.id).split('/').slice(1).join('/')}`
      const problems: string[] = []

      const result = schema.safeParse(ctx.content)
      if (!result.success) {
        for (const issue of result.error.issues) {
          problems.push(`${issue.path.join('.') || '(file)'}: ${issue.message}`)
        }
      }
      for (const field of imageFields) {
        const name = ctx.content[field]
        if (typeof name === 'string' && !imageFiles[name]) {
          problems.push(`${field}: no image named "${name}" in public/images/`)
        }
      }
      if (ctx.collection.name.startsWith('images_')) {
        for (const name of Object.keys(imageFiles)) {
          if (!ctx.content.alt?.[name]) problems.push(`alt.${name}: the photo public/images/${imageFiles[name]} has no description`)
        }
      }
      if (!problems.length) return

      const message = `${file}\n  ${problems.join('\n  ')}`
      if (nuxt.options.dev) {
        console.warn(`\n[check-content] ${message}\n`)
      } else {
        console.error(`\n[check-content] The build stopped because a content file is wrong:\n${message}\n`)
        process.exit(1)
      }
    })
  },
})
