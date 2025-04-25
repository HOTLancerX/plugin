export function createRouteMatcher(routePattern: string) {
  const patternParts = routePattern.split('/');
  return (path: string) => {
    const pathParts = path.split('/');
    if (patternParts.length !== pathParts.length) return null;
    
    const params: Record<string, string> = {};
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];
      if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
        params[patternPart.slice(1, -1)] = pathPart;
      } else if (patternPart !== pathPart) {
        return null;
      }
    }
    return params;
  };
}