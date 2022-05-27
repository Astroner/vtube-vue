type Type<I, V=string> = {
  type: I,
  value: V
}

type ParsedType =
  | Type<"DYNAMIC_PLAYLIST", { code: string, list: string }>
  | Type<"PLAYLIST">
  | Type<"VIDEO">

export const parseUserInput = (text: string): ParsedType => {
  try {
    const url = new URL(text);
    if (url.pathname === "/watch") {
      if (url.searchParams.has("list")) {
        return {
          type: "DYNAMIC_PLAYLIST",
          value: {
            code: url.searchParams.get("v") ?? "",
            list: url.searchParams.get("list") ?? "",
          },
        };
      }
      return {
        type: "VIDEO",
        value: url.searchParams.get("v") ?? "",
      };
    }
    if (url.pathname === "/playlist") {
      return {
        type: "PLAYLIST",
        value: url.searchParams.get("list") ?? "",
      };
    }
    return {
      value: url.pathname.slice(1),
      type: "VIDEO",
    };
  } catch (e) {
    return {
      value: text,
      type: "VIDEO",
    };
  }
};
