// Loads every markdown file in this directory at build time and exposes them
// as structured posts. Add a `.md` file with frontmatter and it appears
// automatically — no registration needed.

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

export interface Post extends PostMeta {
  body: string;
}

const modules = import.meta.glob("./*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const FRONTMATTER = /^---\s*\n([\s\S]*?)\n---\s*\n?/;

const parseFrontmatter = (
  raw: string
): { meta: Record<string, string>; body: string } => {
  const match = raw.match(FRONTMATTER);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    meta[key] = value;
  }
  return { meta, body: raw.slice(match[0].length) };
};

const slugFromPath = (path: string): string =>
  path.replace(/^.*\//, "").replace(/\.md$/, "");

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    const slug = slugFromPath(path);

    // Header image is required for every post. Fail loudly at build time
    // (and in dev) so a post can never ship without one.
    if (!meta.image) {
      throw new Error(
        `Blog post "${slug}" (${path}) is missing the required "image" frontmatter field.`
      );
    }

    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? "",
      description: meta.description ?? "",
      image: meta.image,
      body,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);
