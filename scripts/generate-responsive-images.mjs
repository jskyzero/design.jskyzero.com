import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const sourceDir = path.join(root, 'assets/img');
const outputDir = path.join(root, 'assets/generated/img');
const manifestPath = path.join(root, '_data/responsive_images.json');
const widths = [480, 760, 1140, 1520];
const webpOptions = { quality: 82 };
const pipelineHash = createHash('sha256')
  .update(await fs.readFile(fileURLToPath(import.meta.url)))
  .update(await fs.readFile(path.join(root, 'package-lock.json')))
  .update(JSON.stringify({ widths, webpOptions, versions: sharp.versions }))
  .digest('hex');
const sourceExtensions = new Set(['.jpg', '.jpeg', '.png']);
const contentExtensions = new Set(['.html', '.md', '.markdown']);
const ignoredDirs = new Set(['.git', '_site', 'node_modules', 'vendor', 'assets/generated']);

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectContentFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relative = toPosix(path.relative(root, fullPath));
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(relative) && !ignoredDirs.has(entry.name)) {
        files.push(...await collectContentFiles(fullPath));
      }
    } else if (contentExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function collectReferencedImages() {
  const contentFiles = await collectContentFiles(root);
  const imagePaths = new Set();

  for (const file of contentFiles) {
    const content = await fs.readFile(file, 'utf8');
    const matches = content.matchAll(/\/assets\/img\/[^"')]+?\.(?:jpe?g|png)/gi);
    for (const match of matches) {
      const src = decodeURI(match[0].replace(/[?#].*$/, ''));
      const fullPath = path.join(root, src.slice(1));
      if (await pathExists(fullPath) && sourceExtensions.has(path.extname(fullPath).toLowerCase())) {
        imagePaths.add(fullPath);
      }
    }
  }

  return Array.from(imagePaths);
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function publicPath(filePath) {
  return '/' + toPosix(path.relative(root, filePath));
}

function outputPathFor(sourcePath, width, hash) {
  const relative = path.relative(sourceDir, sourcePath);
  const parsed = path.parse(relative);
  return path.join(outputDir, parsed.dir, `${parsed.base}-${hash}-${width}.webp`);
}

async function processImage(sourcePath) {
  const source = await fs.readFile(sourcePath);
  const hash = createHash('sha256').update(pipelineHash).update(source).digest('hex');
  const metadata = await sharp(source, { failOn: 'none' }).metadata();
  if (!metadata.width || !metadata.height) return null;

  const variants = [];
  const targetWidths = widths.filter((width) => width <= metadata.width);
  if (!targetWidths.length) targetWidths.push(metadata.width);

  for (const width of targetWidths) {
    const targetPath = outputPathFor(sourcePath, width, hash);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    if (!await pathExists(targetPath)) {
      await sharp(source, { failOn: 'none' })
        .resize({ width, withoutEnlargement: true })
        .webp(webpOptions)
        .toFile(targetPath);
    }

    variants.push({ width, src: publicPath(targetPath) });
  }

  return {
    src: publicPath(sourcePath),
    width: metadata.width,
    height: metadata.height,
    webp: variants.sort((a, b) => a.width - b.width)
  };
}

async function main() {
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  const files = (await collectReferencedImages()).sort();
  const manifest = {};

  for (const file of files) {
    const item = await processImage(file);
    if (item && item.webp.length) manifest[item.src] = item;
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  // 清理失效版本，避免恢复旧缓存后将过期图片一起发布。
  const retained = new Set(Object.values(manifest).flatMap((item) =>
    item.webp.map((variant) => path.join(root, variant.src.slice(1)))));
  async function prune(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await prune(file);
      else if (entry.name.endsWith('.webp') && !retained.has(file)) await fs.unlink(file);
    }
  }
  await prune(outputDir);
  console.log(`Generated responsive image manifest for ${Object.keys(manifest).length} images.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
