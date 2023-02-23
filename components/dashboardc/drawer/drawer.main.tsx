import { Box, Transition } from '@mantine/core';
import DrawerBookTicket from './drawer.book.ticket';
import DrawerViewAdvocate from './drawer.view.advocate';
import DrawerViewTicket from './drawer.view.ticket';
import { useClientDashboardContext } from '../../../lib/client/context/client.dashboard.context';

const RighDrawer = () => {
  const { RightDrawerState } = useClientDashboardContext();

  return (
    <>
      <Transition
        mounted={RightDrawerState}
        transition="slide-left"
        duration={400}
        timingFunction="ease-in-out"
      >
        {(styles) => (
          <Box
            sx={() => ({
              zIndex: 3,
              height: '100%',
              position: 'absolute',
              width: '300px',
              right: 0,
            })}
            // py="xl"
            style={styles}
          >
            <Box
              sx={() => ({
                backgroundColor: 'rgba(0, 0, 0, 1)',
                // borderRadius: 10,
                // border: '2px solid white',
                height: '100%',
                overflow: 'auto',
                // scrollbarWidth: 'none',
              })}
              p="lg"
            >
              <DrawerBookTicket />
              <DrawerViewAdvocate />
              <DrawerViewTicket />
            </Box>
          </Box>
        )}
      </Transition>
    </>
  );
};

export default RighDrawer;
