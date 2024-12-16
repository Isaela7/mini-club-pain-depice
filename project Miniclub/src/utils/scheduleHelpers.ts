import { Group } from '../constants/groups';

export function groupActivitiesByName(groups: Group[]): Record<string, Group[]> {
  return groups.reduce((acc, group) => {
    const name = group.name;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(group);
    return acc;
  }, {} as Record<string, Group[]>);
}