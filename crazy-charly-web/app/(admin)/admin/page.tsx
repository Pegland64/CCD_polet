import Link from "next/link";

export default function AdminDashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Back-office Toys Academy</h1>
            <nav className="mt-8">
                <ul className="flex flex-col gap-4">
                    <li>
                        <Link href="/admin/catalogue" className="text-blue-600 hover:underline text-lg">
                            Catalogue des Articles
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/abonnes" className="text-blue-600 hover:underline text-lg">
                            Gestion des Abonnés
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/campagnes" className="text-blue-600 hover:underline text-lg">
                            Gestion des Campagnes
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/composition" className="text-blue-600 hover:underline text-lg">
                            Composition des Box
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
