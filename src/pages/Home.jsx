import { Link } from "react-router";
import { useLanguage } from "../context/LanguageContext";

function Home() {
  const { t } = useLanguage();
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold text-kala-orange mb-4">A2B-SETU</h1>
      <p className="text-xl text-kala-charcoal mb-2">{t("home_tagline")}</p>
      <p className="text-kala-green font-medium mb-8">కళ • సేతు</p>
      <Link
        to="/signup"
        className="inline-block bg-kala-orange text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-[#a8551f] transition"
      >
        {t("home_get_started")}
      </Link>
    </div>
  );
}

export default Home;