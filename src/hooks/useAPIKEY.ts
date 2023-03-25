import { getPreferenceValues } from "@raycast/api";
import { useState } from "react";

interface Preferences {
  API_KEY: string;
}

export const useAPIKEY = () => {
  const [API_KEY] = useState(() => getApiKey());

  function getApiKey() {
    const preferences = getPreferenceValues<Preferences>();
    return preferences.API_KEY;
  }

  return { key: API_KEY };
};
