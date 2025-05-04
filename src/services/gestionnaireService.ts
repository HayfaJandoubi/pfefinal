// src/api/gestionnaireService.ts

export const addGestionnaire = async (gestionnaireData: any) => {
    try {
      // Placeholder for future backend integration
      // Replace the URL with the actual endpoint when ready
      const response = await fetch("http://localhost:5000/api/gestionnaires", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gestionnaireData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add gestionnaire");
      }
  
      return await response.json();
    } catch (error) {
      console.error("addGestionnaire error:", error);
      throw error;
    }
  };
  