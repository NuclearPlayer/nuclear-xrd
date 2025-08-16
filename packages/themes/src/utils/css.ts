export const cssVarBlock = (
  selector: string,
  vars: Record<string, string>,
): string => {
  const lines = Object.entries(vars).map(
    ([key, value]) => `  --${key}: ${value};`,
  );
  return `${selector}{
${lines.join('\n')}
}`;
};
