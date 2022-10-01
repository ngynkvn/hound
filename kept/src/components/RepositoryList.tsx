import styles from './repository-list.module.css';
import * as api from '../api';
import { useQuery } from 'react-query';
import {FaGitAlt} from 'react-icons/fa';

export const Loading = () => {
  return <>Loading ... </>
}
export const Vcs = ({vcs}: {vcs: string}) => {
  switch(vcs) {
    case 'git':
      return <FaGitAlt/>
    default:
      return <>?</>
  }
}

export const RepositoryList = () => {
  const { data, isLoading } = useQuery('repos', api.fetchRepos);
  if (!data || isLoading) {
    return <Loading />;
  }

  const repos = Object.entries(data.data).map(([name, obj]) => {
    return <div className={styles['repository--item']} key={name}>
      <div className={styles['repository--item--block']}>
        {name}
      </div>
      <hr/>
      <div className={styles['repository--item--block']}>
        <a className={styles['repository--subtext']} href={obj.url}>{obj.url} <Vcs vcs={obj.vcs}/></a>
      </div>
    </div>;
  });

  return <div>
    {repos}
  </div>;
}
