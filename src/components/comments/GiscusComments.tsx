"use client";

import { useTheme } from "next-themes";
import Giscus from "@giscus/react";

const GISCUS_REPO = "jdinamarca/jdinamarca.dev";
const GISCUS_REPO_ID = "R_kgDOTBdnfQ";
const GISCUS_CATEGORY = "Comments";
const GISCUS_CATEGORY_ID = "DIC_kwDOTBdnfc4DAC0T";

export function GiscusComments() {
  const { resolvedTheme } = useTheme();

  return (
    <Giscus
      repo={GISCUS_REPO}
      repoId={GISCUS_REPO_ID}
      category={GISCUS_CATEGORY}
      categoryId={GISCUS_CATEGORY_ID}
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={resolvedTheme === "dark" ? "dark_dimmed" : "light"}
      lang="es"
      loading="lazy"
    />
  );
}
