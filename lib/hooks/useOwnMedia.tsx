import { useMediaQuery } from '@mantine/hooks';

const useOwnMedia = () => {
  const BigThan540 = useMediaQuery('(min-width: 540px)', true, {
    getInitialValueInEffect: false,
  });

  const BigThan920 = useMediaQuery('(min-width: 920px)', true, {
    getInitialValueInEffect: false,
  });

  const BigThan800 = useMediaQuery('(min-width: 800px)', true, {
    getInitialValueInEffect: false,
  });

  return { BigThan540, BigThan920, BigThan800 };
};

export default useOwnMedia;
