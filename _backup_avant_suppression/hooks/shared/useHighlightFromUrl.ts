import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Hook pour gérer le highlight d'un élément depuis l'URL
 * Utilisé quand on navigue depuis le dashboard vers une page spécifique
 */
export const useHighlightFromUrl = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    const highlight = searchParams.get("highlight");
    if (highlight) {
      setHighlightId(highlight);

      // Optionnel: supprimer le paramètre après 3 secondes pour nettoyer l'URL
      const timer = setTimeout(() => {
        setHighlightId(null);
        searchParams.delete("highlight");
        setSearchParams(searchParams, { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  const clearHighlight = () => {
    setHighlightId(null);
    searchParams.delete("highlight");
    setSearchParams(searchParams, { replace: true });
  };

  return {
    highlightId,
    clearHighlight,
    isHighlighted: (id: string) => highlightId === id,
  };
};
