import { notFound } from "next/navigation";
import type { Metadata } from "next";
import noticiasData from "@/lib/data/noticias.json";
import NoticiaContent from "./NoticiaContent";

interface Props {
  params: { slug: string };
}

function getNoticia(slug: string) {
  return noticiasData.find((n) => n.slug === slug) ?? null;
}

export function generateStaticParams() {
  return noticiasData.map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const noticia = getNoticia(params.slug);
  if (!noticia) return { title: "Noticia no encontrada" };
  return { title: noticia.titulo, description: noticia.excerpt };
}

export default function NoticiaPage({ params }: Props) {
  const noticia = getNoticia(params.slug);
  if (!noticia) notFound();
  return <NoticiaContent noticia={noticia} slug={params.slug} />;
}
