import { useQuery } from "react-query";
import * as api from "../../api";
import styles from "./search.module.css";
import { ChangeEventHandler, useState } from "react";
import { SearchResults } from "../../api";
import { SearchResultsView } from "./SearchResults";

export const SearchBar = () => {
    const [query, setQuery] = useState("");
    const { data, refetch, isLoading } = useQuery(
        "query",
        () => api.fetchSearchResults({
            q: query,
            stats: true,
            repos: "*",
            rng: "",
            files: "",
            excludeFiles: "",
            i: false,
            literal: false,
        }),
        {
            enabled: false,
        }
    );
    const executeSearch = () => {
        refetch();
    };
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setQuery(e.target?.value);
    };
    return (
        <div>
            <div className={styles["search--searchbar"]}>
                <input onChange={handleChange} value={query}></input>
                <button onClick={executeSearch}>Submit</button>
                <StatResults stats={data?.data.Stats} />
            </div>
            <div>
                <SearchResultsView data={data?.data} />
            </div>
        </div>
    );
};

const StatResults = ({ stats }: { stats?: SearchResults["Stats"]; }) => {
    if (!stats) {
        return null;
    }
    return (
        <span className={styles["search--subtext"]}>
            ({stats.Duration} ms, {stats.FilesOpened} files opened)
        </span>
    );
};

