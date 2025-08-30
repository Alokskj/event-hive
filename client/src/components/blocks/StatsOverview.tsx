import StatCard, { StatCardProps } from '../cards/StatCard';

interface StatsOverviewProps {
    stats: StatCardProps[];
}
const StatsOverview = ({ stats }: StatsOverviewProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    icon={stat.icon}
                    title={stat.title}
                    value={stat.value}
                    description={stat.description}
                />
            ))}
        </div>
    );
};

export default StatsOverview;
