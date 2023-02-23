import { Box, Transition } from '@mantine/core';
import { useAdvoDashboardContext } from '../../../lib/advocate/context/advo.dashboard.context';
import AdvoDrawerViewTicket from './drawer.ticket';
import RightProfile from '../profile/right.profile';

const AdvoRighDrawer = () => {
  const { RightDrawerState } = useAdvoDashboardContext();

  return (
    <>
      <Transition
        mounted={RightDrawerState !== 'close'}
        transition="slide-left"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Box
            sx={() => ({
              zIndex: 3,
              height: '100%',
              position: 'absolute',
              width: '350px',
              right: 0,
            })}
            style={styles}
          >
            <Box
              sx={() => ({
                backgroundColor: 'rgba(0, 0, 0, 1)',
                height: '100%',
                overflow: 'auto',
                scrollbarWidth: 'none',
              })}
              p="lg"
            >
              {RightDrawerState === 'tic' && <AdvoDrawerViewTicket />}
              {RightDrawerState === 'profile' && <RightProfile />}
            </Box>
          </Box>
        )}
      </Transition>
    </>
  );
};

export default AdvoRighDrawer;
