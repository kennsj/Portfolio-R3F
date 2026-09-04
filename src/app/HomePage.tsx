import { Suspense } from "react";
import Header from "./components/Layout/Header/Header";
import Aurora from "./components/Layout/Aurora/Aurora";
import Expertise from "./components/Layout/Expertise/Expertise";
import Projects from "./components/Layout/Project/Projects";
import { useI18n } from "./hooks/useI18n";
import { useAuroraSectionState } from "./hooks/useAuroraSectionState";
import styles from "./styles/Homepage.module.scss";
import HomeAbout from "./components/Layout/HomeAbout/HomeAbout";

export default function HomePage() {
  const { t } = useI18n();
  useAuroraSectionState();

  return (
    <>
      <div
        data-aurora-state
        data-aurora-presence="0.92"
        data-aurora-color="#9df5bf"
      >
        <Header signalNavIntroAfterHero />
      </div>

      <HomeAbout />

      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <Expertise />
      </Suspense>
      <section
        id="signal"
        className={styles.aurora}
        data-aurora-state
        data-aurora-presence="1.16"
        data-aurora-color="#a8f3c3"
        aria-label={t.auroraTitleLineOne}
      >
        <Aurora />
      </section>
    </>
  );
}
