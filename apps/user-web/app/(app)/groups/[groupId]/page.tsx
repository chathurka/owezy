import { GroupOverview } from '@/features/groups/presentation/group-overview';

export default async function GroupOverviewPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  return <GroupOverview groupId={groupId} />;
}
