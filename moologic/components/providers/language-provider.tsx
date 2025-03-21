"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Define available languages
type Language = "en" | "am" | "om" | "fr" | "sw" | "es"

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const initialState: LanguageProviderState = {
  language: "en",
  setLanguage: () => null,
  t: (key: string) => key,
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

// Translations
const translations = {
  en: {
    // General
    Dashboard: "Dashboard",
    Settings: "Settings",
    Notifications: "Notifications",
    Statistics: "Statistics",
    Finance: "Finance",
    Livestock: "Livestock",
    Health: "Health",
    "All Animals": "All Animals",
    "Milk Yield": "Milk Yield",
    "Gestation Chart": "Gestation Chart",
    "Add New": "Add New",
    Save: "Save",
    Cancel: "Cancel",
    Delete: "Delete",
    Edit: "Edit",
    Search: "Search",
    Filter: "Filter",
    Export: "Export",
    Import: "Import",
    Print: "Print",
    Download: "Download",
    Upload: "Upload",
    Submit: "Submit",
    Reset: "Reset",
    Apply: "Apply",
    Close: "Close",
    Confirm: "Confirm",
    Back: "Back",
    Next: "Next",
    Previous: "Previous",
    First: "First",
    Last: "Last",
    Yes: "Yes",
    No: "No",
    OK: "OK",
    "Disease prediction": "Disease Prediction",
    "Health Management": "Health Management",
    "Milk yeald": "Milk Yield",
    "Upgrade Now": "Upgrade Now",
    LiveStock: "Livestock",
    "Add new cattle": "Add New Cattle",
    Notification: "Notifications",
    "Change language": "Change language",
    "Toggle theme": "Toggle theme",
    "Dark mode": "Dark mode",
    "Light mode": "Light mode",
    "System preference": "System preference",
    "Language & Theme": "Language & Theme",
    // Add more translations as needed
  },
  fr: {
    // General
    Dashboard: "Tableau de bord",
    Settings: "Paramètres",
    Notifications: "Notifications",
    Statistics: "Statistiques",
    Finance: "Finance",
    Livestock: "Bétail",
    Health: "Santé",
    "All Animals": "Tous les animaux",
    "Milk Yield": "Production laitière",
    "Gestation Chart": "Graphique de gestation",
    "Add New": "Ajouter",
    Save: "Enregistrer",
    Cancel: "Annuler",
    Delete: "Supprimer",
    Edit: "Modifier",
    Search: "Rechercher",
    Filter: "Filtrer",
    Export: "Exporter",
    Import: "Importer",
    Print: "Imprimer",
    Download: "Télécharger",
    Upload: "Téléverser",
    Submit: "Soumettre",
    Reset: "Réinitialiser",
    Apply: "Appliquer",
    Close: "Fermer",
    Confirm: "Confirmer",
    Back: "Retour",
    Next: "Suivant",
    Previous: "Précédent",
    First: "Premier",
    Last: "Dernier",
    Yes: "Oui",
    No: "Non",
    OK: "OK",
    "Disease prediction": "Prédiction de maladie",
    "Health Management": "Gestion de la santé",
    "Milk yeald": "Production laitière",
    "Upgrade Now": "Mettre à niveau",
    LiveStock: "Bétail",
    "Add new cattle": "Ajouter un nouveau bétail",
    Notification: "Notifications",
    "Change language": "Changer de langue",
    "Toggle theme": "Changer de thème",
    "Dark mode": "Mode sombre",
    "Light mode": "Mode clair",
    "System preference": "Préférence système",
    "Language & Theme": "Langue et thème",
    // Add more translations as needed
  },
  sw: {
    // General
    Dashboard: "Dashibodi",
    Settings: "Mipangilio",
    Notifications: "Arifa",
    Statistics: "Takwimu",
    Finance: "Fedha",
    Livestock: "Mifugo",
    Health: "Afya",
    "All Animals": "Wanyama Wote",
    "Milk Yield": "Uzalishaji wa Maziwa",
    "Gestation Chart": "Chati ya Ujauzito",
    "Add New": "Ongeza Mpya",
    Save: "Hifadhi",
    Cancel: "Ghairi",
    Delete: "Futa",
    Edit: "Hariri",
    Search: "Tafuta",
    Filter: "Chuja",
    Export: "Hamisha",
    Import: "Leta",
    Print: "Chapisha",
    Download: "Pakua",
    Upload: "Pakia",
    Submit: "Wasilisha",
    Reset: "Weka upya",
    Apply: "Tumia",
    Close: "Funga",
    Confirm: "Thibitisha",
    Back: "Rudi",
    Next: "Ifuatayo",
    Previous: "Iliyotangulia",
    First: "Kwanza",
    Last: "Mwisho",
    Yes: "Ndio",
    No: "Hapana",
    OK: "Sawa",
    "Disease prediction": "Utabiri wa Magonjwa",
    "Health Management": "Usimamizi wa Afya",
    "Milk yeald": "Uzalishaji wa Maziwa",
    "Upgrade Now": "Boresha Sasa",
    LiveStock: "Mifugo",
    "Add new cattle": "Ongeza ng'ombe mpya",
    Notification: "Arifa",
    "Change language": "Badilisha lugha",
    "Toggle theme": "Badilisha mandhari",
    "Dark mode": "Hali ya giza",
    "Light mode": "Hali ya mwanga",
    "System preference": "Mapendeleo ya mfumo",
    "Language & Theme": "Lugha na Mandhari",
    // Add more translations as needed
  },
  es: {
    // General
    Dashboard: "Panel de control",
    Settings: "Configuración",
    Notifications: "Notificaciones",
    Statistics: "Estadísticas",
    Finance: "Finanzas",
    Livestock: "Ganado",
    Health: "Salud",
    "All Animals": "Todos los animales",
    "Milk Yield": "Producción de leche",
    "Gestation Chart": "Gráfico de gestación",
    "Add New": "Añadir nuevo",
    Save: "Guardar",
    Cancel: "Cancelar",
    Delete: "Eliminar",
    Edit: "Editar",
    Search: "Buscar",
    Filter: "Filtrar",
    Export: "Exportar",
    Import: "Importar",
    Print: "Imprimir",
    Download: "Descargar",
    Upload: "Subir",
    Submit: "Enviar",
    Reset: "Restablecer",
    Apply: "Aplicar",
    Close: "Cerrar",
    Confirm: "Confirmar",
    Back: "Atrás",
    Next: "Siguiente",
    Previous: "Anterior",
    First: "Primero",
    Last: "Último",
    Yes: "Sí",
    No: "No",
    OK: "OK",
    "Disease prediction": "Predicción de enfermedades",
    "Health Management": "Gestión de salud",
    "Milk yeald": "Producción de leche",
    "Upgrade Now": "Actualizar ahora",
    LiveStock: "Ganado",
    "Add new cattle": "Añadir nuevo ganado",
    Notification: "Notificaciones",
    "Change language": "Cambiar idioma",
    "Toggle theme": "Cambiar tema",
    "Dark mode": "Modo oscuro",
    "Light mode": "Modo claro",
    "System preference": "Preferencia del sistema",
    "Language & Theme": "Idioma y tema",
    // Add more translations as needed
  },
  am: {
    // General
    Dashboard: "ዳሽቦርድ",
    Settings: "ቅንብሮች",
    Notifications: "ማሳወቂያዎች",
    Statistics: "ስታቲስቲክስ",
    Finance: "ፋይናንስ",
    Livestock: "እንስሳት",
    Health: "ጤና",
    "All Animals": "ሁሉም እንስሳት",
    "Milk Yield": "የወተት ምርት",
    "Gestation Chart": "የእርግዝና ቻርት",
    "Add New": "አዲስ ጨምር",
    Save: "አስቀምጥ",
    Cancel: "ሰርዝ",
    Delete: "አጥፋ",
    Edit: "አስተካክል",
    Search: "ፈልግ",
    Filter: "አጣራ",
    Export: "ላክ",
    Import: "አስገባ",
    Print: "አትም",
    Download: "አውርድ",
    Upload: "ስቀል",
    Submit: "አስገባ",
    Reset: "ዳግም አስጀምር",
    Apply: "ተግብር",
    Close: "ዝጋ",
    Confirm: "አረጋግጥ",
    Back: "ተመለስ",
    Next: "ቀጣይ",
    Previous: "ቀዳሚ",
    First: "መጀመሪያ",
    Last: "መጨረሻ",
    Yes: "አዎ",
    No: "አይ",
    OK: "እሺ",
    "Disease prediction": "የበሽታ ትንበያ",
    "Health Management": "የጤና አያያዝ",
    "Milk yeald": "የወተት ምርት",
    "Upgrade Now": "አሁን አሻሽል",
    LiveStock: "እንስሳት",
    "Add new cattle": "አዲስ ከብት ጨምር",
    Notification: "ማሳወቂያዎች",
    "Change language": "ቋንቋ ቀይር",
    "Toggle theme": "ገጽታ ቀይር",
    "Dark mode": "ጨለማ ሁነታ",
    "Light mode": "ብርሃን ሁነታ",
    "System preference": "የስርዓት ምርጫ",
    "Language & Theme": "ቋንቋ እና ገጽታ",
    // Add more translations as needed
  },
  om: {
    // General
    Dashboard: "Daashboordii",
    Settings: "Qindeessaa",
    Notifications: "Beeksisa",
    Statistics: "Istaatistiksii",
    Finance: "Faayinaansii",
    Livestock: "Horii",
    Health: "Fayyaa",
    "All Animals": "Horii Hunda",
    "Milk Yield": "Oomisha Aannan",
    "Gestation Chart": "Chaartii Ulfaa",
    "Add New": "Haaraa Dabaluu",
    Save: "Olkaa'i",
    Cancel: "Haqi",
    Delete: "Balleessi",
    Edit: "Gulaali",
    Search: "Barbaadi",
    Filter: "Calleessi",
    Export: "Baasi",
    Import: "Galchi",
    Print: "Maxxansi",
    Download: "Buusi",
    Upload: "Olkaa'i",
    Submit: "Galchi",
    Reset: "Irra deebi'i",
    Apply: "Itti fayyadami",
    Close: "Cufuu",
    Confirm: "Mirkaneessi",
    Back: "Duubatti",
    Next: "Itti aanee",
    Previous: "Duraa",
    First: "Jalqaba",
    Last: "Dhumaa",
    Yes: "Eeyyee",
    No: "Lakki",
    OK: "Tole",
    "Disease prediction": "Tilmaama Dhukkubaa",
    "Health Management": "Bulchiinsa Fayyaa",
    "Milk yeald": "Oomisha Aannan",
    "Upgrade Now": "Amma Foyyessi",
    LiveStock: "Horii",
    "Add new cattle": "Sa'a Haaraa Dabaluu",
    Notification: "Beeksisa",
    "Change language": "Afaan jijjiiri",
    "Toggle theme": "Bifa jijjiiri",
    "Dark mode": "Bifa dukkana",
    "Light mode": "Bifa ifa",
    "System preference": "Filannoo sirna",
    "Language & Theme": "Afaan fi Bifa",
    // Add more translations as needed
  },
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check for stored language preference
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem(storageKey) as Language
      return storedLanguage || defaultLanguage
    }
    return defaultLanguage
  })

  // Update language preference in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, language)
    }
  }, [language, storageKey])

  // Translation function
  const t = (key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key]
    }
    // Fallback to English if translation doesn't exist
    return translations.en[key] || key
  }

  const value = {
    language,
    setLanguage: (language: Language) => {
      setLanguage(language)
    },
    t,
  }

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}

export const useTranslation = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }

  return context
}

