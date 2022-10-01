import { useQueries, useQuery } from "react-query";
import * as api from "../../api";
import styles from "./search.module.css";
import { ChangeEventHandler, useState } from "react";
import { SearchResults } from "../../api";
import { SearchResultsView } from "./SearchResults";

export const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [
        { data: queryData, refetch: fetchQueryData, isLoading: queryLoading },
        { data: repos, isLoading: reposLoading },
    ] = useQueries([
        {
            queryKey: "query",
            queryFn: () =>
                api.fetchSearchResults({
                    q: query,
                    stats: true,
                    repos: "*",
                    rng: "",
                    files: "",
                    excludeFiles: "",
                    i: false,
                    literal: false,
                }),
            enabled: false,
        },
        {
            queryKey: "repos",
            queryFn: api.fetchRepos,
        },
    ]);
    if (!repos || reposLoading || queryLoading ) {
        return <>Loading</>;
    }
    const executeSearch = () => {
        fetchQueryData();
    };
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setQuery(e.target?.value);
    };
    return (
        <div>
            <div className={styles["search--searchbar"]}>
                <input onChange={handleChange} value={query}></input>
                <button onClick={executeSearch}>Submit</button>
                <StatResults stats={queryData?.data?.Stats} />
            </div>
            <div>
                <SearchResultsView data={queryData?.data} query={query} />
            </div>
        </div>
    );
};

const StatResults = ({ stats }: { stats?: SearchResults["Stats"] }) => {
    if (!stats) {
        return null;
    }
    return (
        <span className={styles["search--subtext"]}>
            ({stats.Duration} ms, {stats.FilesOpened} files opened)
        </span>
    );
};
