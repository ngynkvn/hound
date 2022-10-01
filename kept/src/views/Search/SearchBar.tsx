import { useQueries, useQuery } from "react-query";
import * as api from "../../api";
import styles from "./search.module.css";
import { ChangeEventHandler, useState } from "react";
import { SearchResults } from "../../api";
import { SearchResultsView } from "./SearchResults";

export const SearchBar = () => {
    const [queryInput, setQueryInput] = useState("");
    const [lastQuerySent, setLastQuerySent] = useState("");
    const [
        { data: queryData, refetch: fetchQueryData, isLoading: queryLoading },
        { data: repos, isLoading: reposLoading },
    ] = useQueries([
        {
            queryKey: "query",
            queryFn: () =>
                api.fetchSearchResults({
                    q: queryInput,
                    stats: true,
                    repos: "*",
                    rng: "",
                    files: "",
                    excludeFiles: "",
                    i: false,
                    literal: false,
                }),
            enabled: false,
            onSuccess() {
                setLastQuerySent(queryInput);
            },
        },
        {
            queryKey: "repos",
            queryFn: api.fetchRepos,
            staleTime: Infinity,
        },
    ]);
    if (!repos || reposLoading || queryLoading) {
        return <>Loading</>;
    }
    const executeSearch = () => {
        fetchQueryData();
    };
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setQueryInput(e.target?.value);
    };
    return (
        <div>
            <div className={styles["search--searchbar"]}>
                <input onChange={handleChange} value={queryInput}></input>
                <button onClick={executeSearch}>Submit</button>
                <StatResults stats={queryData?.data?.Stats} />
            </div>
            <div>
                <SearchResultsView data={queryData?.data} query={lastQuerySent} />
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
