import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./HomePage.module.css";
import MapaD3Geojson from "../../components/mapa/MapComponent";
import CasesBarChart from "../../components/grafico_barra/casesBarChart";
import PieCharts from "../../components/grafico_pizza_status/PieCharts";

const Inicio = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div>
        <Nav />
        <div className={styles.marginContent}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={`${styles.dataCard} ${styles.revenueCard}`}>
                <MapaD3Geojson />
              </div>
              <div
                className={`${styles.dataCard} ${styles.customerCard}`}
              >
                <CasesBarChart/>
              </div>
              
            </div>
            <div className={`${styles.dataCard} ${styles.categoryCard}`}>
                <PieCharts/>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
