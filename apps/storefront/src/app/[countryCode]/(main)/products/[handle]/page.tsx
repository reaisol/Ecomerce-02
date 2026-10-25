import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { brand } from "@lib/brand"
import { getCategoryById } from "@lib/services/category-service"
import { getProductBySlug } from "@lib/services/product-service"
import { getInitialVariant } from "@modules/products/lib/variant-selection"
import ProductDetailTemplate from "@modules/products/templates/product-detail-template"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ variant?: string | string[] }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { handle } = await props.params
  const product = await getProductBySlug(handle)

  if (!product) notFound()

  const description = product.shortDescription || product.description

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${brand.name}`,
      description,
      images: product.thumbnail
        ? [{ url: product.thumbnail.url, alt: product.thumbnail.alt }]
        : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const [{ handle }, { variant }] = await Promise.all([
    props.params,
    props.searchParams,
  ])
  const product = await getProductBySlug(handle)

  if (!product) notFound()

  const category = await getCategoryById(product.categoryId)
  const variantId = Array.isArray(variant) ? variant[0] : variant

  return (
    <ProductDetailTemplate
      product={product}
      category={category}
      initialVariant={getInitialVariant(product, variantId)}
    />
  )
}
