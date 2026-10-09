// Site-wide settings (name, contact details, socials), fetched once and shared by every page
export async function useSite() {
  const { data } = await useFetch("/api/site", { key: "site" });
  if (!data.value) throw createError({ statusCode: 500, statusMessage: "Site settings could not be loaded" });
  return data as Ref<NonNullable<typeof data.value>>;
}
