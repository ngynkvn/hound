import { RepositoryList } from "../../components/RepositoryList";
import styles from "./search.module.css";
import { SearchBar } from "./SearchBar";
const Search = () => {
    return (
        <div className={styles["two-column"]}>
            <div>
                <RepositoryList />
            </div>
            <div>
                <SearchBar />
            </div>
        </div>
    );
};

export default Search;
