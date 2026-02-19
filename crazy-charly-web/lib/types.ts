// crazy-charly-web/lib/types.ts

export interface Article {
    id: string;
    designation: string;
    categorie: string;
    trancheAge: string;
    etat: string;
    prix: number;
    poids: number;
    statut?: string;
}

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface Subscriber {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    trancheAgeEnfant: string;
    preferences: string; // CSV from API (ex: "SOC,FIG,EVL")
}

export interface Campaign {
    id: string;
    nom: string;
    createdAt: string;
    poidsMax: number;
    statut: string;
    totalScore: number | null;
    _count?: {
        boxes: number;
    };
}

export interface BoxResult {
    id: string;
    abonne: {
        id?: string;
        nom: string;
        prenom: string;
        email?: string;
        trancheAgeEnfant?: string;
    };
    articles: Article[];
    score: number;
    poidsTotal: number;
    prixTotal: number;
    validated?: boolean;
}

export interface DashboardStats {
    totalArticles: number;
    totalAbonnes: number;
    scoreMoyen: number;
    stockParCategorie: { id: string; count: number; color: string }[];
    repartitionEtat: { id: string; label: string; percentage: number; color: string }[];
    repartitionAge: { id: string; count: number }[];
}
