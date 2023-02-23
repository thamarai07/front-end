import { createStyles } from '@mantine/core';

export const useWorldStyles = createStyles((theme) => ({
  Input: {
    border: `2px solid ${theme.colors.gray[5]}`,
    borderRadius: theme.radius.sm,
    padding: `${0}px ${theme.spacing.sm}px`,
  },
}));
