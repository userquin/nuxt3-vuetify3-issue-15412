export const useShowSnack = () => useState(() => false);
export const useSnackType = () => useState<string | undefined>(() => 'success');
export const useSnackTitle = () => useState(() => 'Snack title');
export const useSnackMessage = () => useState<string | undefined>(() => '');

/**
 * Method used to display snackbar
 * @param Snack data
 */
export const useSnack = ({
  show,
  type,
  title,
  message,
}: {
  show: boolean;
  type?: string;
  title: string;
  message?: string;
}) => {
  const s = useShowSnack();
  const t = useSnackTitle();
  const m = useSnackMessage();
  const ty = useSnackType();

  s.value = show;
  t.value = title;
  m.value = message;
  ty.value = type;
};
