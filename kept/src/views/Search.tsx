import { RepositoryList } from '../components/RepositoryList';
import styles from './search.module.css';
const Search = () => {
    return <div className={styles['two-column']}>
        <div>
          <RepositoryList/>
        </div>
        <div>
            <SearchBar/>
        </div>
    </div>
}

const SearchBar = () => {
    return <input></input>
}

export default Search