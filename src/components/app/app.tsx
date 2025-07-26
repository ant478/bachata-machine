import { useEffect } from 'react';
import { Header } from 'src/components/header/header';
import { Footer } from 'src/components/footer/footer';
import { BachataMachine } from 'src/components/bachata_machine/bachata_machine';
import { fetchCombinations } from 'src/store/slices/combination_slice';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import styles from './app.module.scss';

export function App() {
    const dispatch = useAppDispatch();
    const isLoaded = useAppSelector(state => state.combinations.loaded);

    useEffect(() => {
        dispatch(fetchCombinations());
    }, [dispatch]);

    if (!isLoaded) {
        return null;
    }

    return (
        <div className={styles.base}>
            <Header />
            <BachataMachine className={styles.bachataMachineMix} />
            <Footer />
        </div>
    );
}
