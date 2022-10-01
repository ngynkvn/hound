import * as api from "../../api";
import styles from "./search.module.css";
import { SearchResults } from "../../api";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";

export const SearchResultsView = ({
    data,
    query,
}: {
    data?: SearchResults;
    query: string;
}) => {
    const results = Object.entries(data?.Results ?? {});
    return (
        <div className={styles["search--result"]}>
            {results.map((r) => ResultItem(r, query))}
        </div>
    );
};
const ResultItem = ([name, result]: [string, api.Result], query: string) => {
    return (
        <div className={styles["search--result--repo"]}>
            <h3>
                {name}{" "}
                <span className={styles["search--subtext"]}>
                    ({result.FilesWithMatch} matches){" "}
                </span>
            </h3>
            <div>{result.Matches.map((m) => <MatchResult m={m} query={query}/>)}</div>
        </div>
    );
};
const MatchResult = ({m, query}: {m: api.MatchResult, query: string}) => {
    const [collapsed, setCollapsed] = useState(false);
    const toggle = () => setCollapsed(!collapsed);
    return (
        <div key={m.Filename}>
            <div>
                <button
                    onClick={toggle}
                    style={{ width: "100%", textAlign: "left" }}
                    className={styles["search--match--header"]}
                >
                    <a href="#">{m.Filename}</a>
                    {collapsed ? <FiChevronUp /> : <FiChevronDown />}
                </button>
            </div>
            <div>{!collapsed && m.Matches.map((m) => MatchItem({m, query}))}</div>
        </div>
    );
};
const MatchItem = ({m, query}: {m: api.Match, query: string}) => {
    return (
        <div className={styles["search--match--item"]}>
            {m.Before.map((line, i, { length }) => {
                return (
                    <Line number={m.LineNumber - (length - i)} line={line} />
                );
            })}
            <Line number={m.LineNumber} line={m.Line} query={query} />
            {m.After.map((line, i) => {
                return <Line number={m.LineNumber + 1 + i} line={line} />;
            })}
        </div>
    );
};
type LineProps = {
    number: number;
    line: string;
    query?: string;
};
const Line = ({ number, line, query }: LineProps) => {
    if (query) {
        try {
            const re = new RegExp(query);
            const search = line.match(re);
            if (!search || search.index === undefined) {
                throw `could not find regex in string ${search} ${search?.index}`;
            }
            const match_index = search.index;
            const len_match = search[0].length;
            const before = line.slice(0, match_index);
            const middle = line.slice(match_index, match_index + len_match);
            const after = line.slice(match_index + len_match);
            return (
                <div>
                    <span>{number}</span>: {before}
                    <span className={styles["search--line--match"]}>
                        {middle}
                    </span>
                    {after}
                </div>
            );
        } catch (e) {
            console.warn("regular expression failed to parse." + e);
        }
    }
    return (
        <div>
            <span>{number}</span>: <span>{line}</span>
        </div>
    );
};
