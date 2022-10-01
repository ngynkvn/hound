import * as api from "../../api";
import styles from "./search.module.css";
import { SearchResults } from "../../api";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";
import React from "react";

export const SearchResultsView = ({
    data,
    query,
}: {
    data?: SearchResults;
    query: RegExp;
}) => {
    const results = Object.entries(data?.Results ?? {});
    return (
        <div className={styles["search--result"]}>
            {results.map((r) => <ResultItem key={r[0]+query} item={r} query={query}/>)}
        </div>
    );
};
type ResultItemProps = {
    item: [string, api.Result],
    query: RegExp
}
const ResultItem = ({item: [name, result], query}: ResultItemProps) => {
    return (
        <div className={styles["search--result--repo"]}>
            <h3>
                {name}{" "}
                <span className={styles["search--subtext"]}>
                    ({result.FilesWithMatch} matches){" "}
                </span>
            </h3>
            <div>{result.Matches.map((m) => <MatchResult key={m.Filename} m={m} query={query}/>)}</div>
        </div>
    );
};
const MatchResult = React.memo(({m, query}: {m: api.MatchResult, query: RegExp}) => {
    const [collapsed, setCollapsed] = useState(false);
    const toggle = () => setCollapsed(!collapsed);
    return (
        <div>
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
            <div>{!collapsed && m.Matches.map((m) => <MatchItem key={m.Line+m.LineNumber} m={m} query={query}/>)}</div>
        </div>
    );
});
const MatchItem = (({m, query}: {m: api.Match, query: RegExp}) => {
    return (
        <div className={styles["search--match--item"]}>
            {m.Before.map((line, i, { length }) => {
                const number = m.LineNumber - (length - i);
                return (
                    <Line key={number} number={number} line={line} />
                );
            })}
            <Line number={m.LineNumber} line={m.Line} query={query} />
            {m.After.map((line, i) => {
                return <Line key={m.LineNumber+1+i} number={m.LineNumber + 1 + i} line={line} />;
            })}
        </div>
    );
});
type LineProps = {
    number: number;
    line: string;
    query?: RegExp;
};
const Line = React.memo(({ number, line, query }: LineProps) => {
    if (query) {
        try {
            const search = line.match(query);
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
});
