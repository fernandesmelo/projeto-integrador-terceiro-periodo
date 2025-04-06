import styles from './Nav.module.css';
import { CgScreen } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";
import { TbAlertHexagonFilled } from "react-icons/tb";
import { RiToothFill, RiFileShield2Fill } from "react-icons/ri";
import { PiFilesFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();

    function handleAdmin() {
        navigate('/administrador-do-sistema')
    }

    return (
        <div>
            <div className={styles.nav}>
                <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate('/')}>
                    <CgScreen size={31} strokeWidth={1} style={{ color: "var(--icons)" }} /> Início
                </p>
                <p onClick={() => navigate('/casos')} className={styles.item} tabIndex={0} role="button">
                    <RiFileShield2Fill size={32} style={{ color: "var(--icons)" }} /> Casos Periciais
                </p>
                <p className={styles.item} tabIndex={0} role="button">
                    <TbAlertHexagonFilled size={32} style={{ color: "var(--icons)" }} /> Evidências
                </p>
                <p className={styles.item} tabIndex={0} role="button">
                    <PiFilesFill size={32} style={{ color: "var(--icons)" }} /> Laudos
                </p>
                <p className={styles.item} tabIndex={0} role="button">
                    <RiToothFill size={32} style={{ color: "var(--icons)" }} /> Banco Odonto-Legal
                </p>
                <p className={styles.item} tabIndex={0} role="button" onClick={handleAdmin}>
                    <MdAdminPanelSettings size={32} style={{ color: "var(--icons)" }} /> Admin
                </p>
            </div>
        </div>
    );
};

export default Nav;