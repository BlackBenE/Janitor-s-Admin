import { useNavigate } from "react-router-dom";

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: "user" | "property" | "service" | "invoice" | "quote" | "provider";
  route: string;
}

export const searchEntities = async (
  query: string
): Promise<SearchResult[]> => {
  // This is where you would typically make API calls to your backend
  // For now, we'll simulate some search results

  // Example search implementation:
  const results: SearchResult[] = [];

  if (query.length < 2) return results;

  const lowerQuery = query.toLowerCase();

  // Example: Search users
  // Replace this with actual API calls to your backend
  const mockUsers = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ];

  mockUsers.forEach((user) => {
    if (
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: user.id,
        title: user.name,
        description: user.email,
        type: "user",
        route: `/users/${user.id}`,
      });
    }
  });

  // Example: Search services
  // Replace with actual service data from your backend
  const mockServices = [
    { id: "1", name: "Cleaning Service", category: "Maintenance" },
    { id: "2", name: "Plumbing Service", category: "Repairs" },
  ];

  mockServices.forEach((service) => {
    if (
      service.name.toLowerCase().includes(lowerQuery) ||
      service.category.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: service.id,
        title: service.name,
        description: service.category,
        type: "service",
        route: `/services/${service.id}`,
      });
    }
  });

  // Add more search categories as needed...

  return results;
};

// Hook to handle search navigation
export const useSearchNavigation = () => {
  const navigate = useNavigate();

  const handleSearchResultClick = (result: SearchResult) => {
    navigate(result.route);
  };

  return { handleSearchResultClick };
};
