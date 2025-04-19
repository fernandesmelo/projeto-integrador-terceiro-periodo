import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./HomePage.module.css";
import MapaD3Geojson from "../../components/map/MapComponent";
import CasesBarChart from "../../components/bar_charts/CasesBarCharts";
import PieCharts from "../../components/pie_chart/PieCharts";
import VictimsStatusDoughnut from "../../components/doughnut_chart/DoughnutChart";

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
              <div className={`${styles.dataCard} ${styles.customerCard}`}>
                <CasesBarChart />
              </div>
            </div>
            <div className={styles.row}>
              <div className={`${styles.dataCard} ${styles.categoryCard}`}>
                <PieCharts />
              </div>
              <div className={`${styles.dataCard} ${styles.categoryCard}`}>
                <VictimsStatusDoughnut />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
