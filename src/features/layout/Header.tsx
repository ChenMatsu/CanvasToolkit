import { useTranslation } from "react-i18next";
import {
  BiPlusCircle,
  BiDoorOpen,
  BiSave,
  BiLink,
  BiChat,
  BiDownload,
} from "react-icons/bi";
import "./Header.scss";

const Header = () => {
  const { t } = useTranslation(["Layout"]);

  return (
    <div id="layout-header">
      <ul>
        <li>
          <BiPlusCircle className="header-icons" /> {t("HeaderLeft_New")}
        </li>
        <li>
          <BiDoorOpen className="header-icons" /> {t("HeaderLeft_Open")}
        </li>
        <li>
          <BiSave className="header-icons" /> {t("HeaderLeft_Save")}
        </li>
      </ul>

      <ul>
        <li>
          <BiLink className="header-icons" /> {t("HeaderLeft_New")}
        </li>
        <li>
          <BiChat className="header-icons" /> {t("HeaderLeft_Open")}
        </li>
        <li>
          <BiDownload className="header-icons" /> {t("HeaderLeft_Save")}
        </li>
      </ul>
    </div>
  );
};

export default Header;
