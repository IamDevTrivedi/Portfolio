import { getPosts } from "@/app/utils/utils";
import { baseURL, routes as routesConfig } from "@/app/resources";

export default async function sitemap() {
    const normalizedBaseURL = /^(https?:\/\/)/.test(baseURL) ? baseURL : `https://${baseURL}`;
    const siteURL = normalizedBaseURL.endsWith("/")
        ? normalizedBaseURL.slice(0, -1)
        : normalizedBaseURL;

    const blogs = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
        url: `${siteURL}/blog/${post.slug}`,
        lastModified: post.metadata.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    const works = getPosts(["src", "app", "work", "projects"]).map((post) => ({
        url: `${siteURL}/work/${post.slug}`,
        lastModified: post.metadata.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    const activeRoutes = Object.keys(routesConfig).filter(
        (route) => routesConfig[route as keyof typeof routesConfig],
    );

    const routePriorityMap: Record<string, number> = {
        "/": 1,
        "/resume": 0.95,
        "/work": 0.9,
        "/about": 0.8,

        "/blog": 0.6,
    };

    const routes = activeRoutes.map((route) => ({
        url: `${siteURL}${route !== "/" ? route : ""}`,
        lastModified: new Date().toISOString().split("T")[0],
        changeFrequency:
            route === "/" || route === "/resume" ? ("weekly" as const) : ("monthly" as const),
        priority: routePriorityMap[route] ?? 0.5,
    }));

    return [...routes, ...blogs, ...works];
}
