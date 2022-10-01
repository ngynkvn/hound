import { useQuery } from "react-query";
import { RepositoryList } from "../../components/RepositoryList";
import * as api from "../../api";
import styles from "./search.module.css";
import { ChangeEventHandler, useState } from "react";
import { stableValueHash } from "react-query/types/core/utils";
import { SearchResults } from "../../api";
import { FiChevronDown } from "react-icons/fi";
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

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const { data, refetch, isLoading } = useQuery(
        "query",
        () =>
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
                <Results data={data?.data} />
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

const Results = ({ data }: { data?: SearchResults }) => {
    const results = Object.entries(data?.Results ?? {});
    return (
        <div className={styles["search--result"]}>
            {results.map(ResultItem)}
        </div>
    );
};

const ResultItem = ([name, result]: [string, api.Result]) => {
    return (
        <div className={styles["search--result--repo"]}>
            <h3>
                {name}{" "}
                <span className={styles["search--subtext"]}>
                    ({result.FilesWithMatch} matches){" "}
                </span>
                <a href="#">
                    <FiChevronDown onClick={() => alert("TODO")} />
                </a>
            </h3>
            <div>{result.Matches.map(MatchResult)}</div>
        </div>
    );
};

const MatchResult = (m: api.MatchResult) => {
    return (
        <div key={m.Filename}>
            <div>{m.Filename}</div>
            <div>{m.Matches.map(MatchItem)}</div>
        </div>
    );
};
const MatchItem = (m: api.Match) => {
    return (
        <div className={styles["search--match--item"]}>
            {m.Before.map((line, i, { length }) => {
                return (
                    <Line number={m.LineNumber - (length - i)} line={line} />
                );
            })}
            <hr />
            <Line number={m.LineNumber} line={m.Line} />
            <hr />
            {m.After.map((line, i) => {
                return <Line number={m.LineNumber + 1 + i} line={line} />;
            })}
        </div>
    );
};
type LineProps = {
    number: number;
    line: string;
};
const Line = ({ number, line }: LineProps) => {
    return (
        <div>
            <span>{number}</span>: <span>{line}</span>
        </div>
    );
};

export default Search;
