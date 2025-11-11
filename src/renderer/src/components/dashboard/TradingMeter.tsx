import { Box, CardContent, Chip, Grid, Typography } from '@mui/material'
import { getScoreCategory } from '@renderer/utils/helper';
import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis } from 'recharts'

export default function TradingMeter({ score }) {
    const maxScore = 850;
    const minScore = 300;
    const percentage = ((score - minScore) / (maxScore - minScore)) * 100;
    const category = getScoreCategory(score);

    // console.log(percentage, "percentage");

    const radialData = [{
        name: 'Score',
        value: percentage,
        fill: category.color,

    }];

    const calculateScorePosition = () => {
        if (score <= minScore) return 0;
        if (score >= maxScore) return 100;
        return ((score - minScore) / (maxScore - minScore)) * 100;
    };

    const scorePosition = calculateScorePosition();

    // Category ranges and positions for labels
    const categories = [
        { label: 'High Risk', range: [300, 549], position: 0 },
        { label: 'Beginner', range: [550, 599], position: 45.5 },
        { label: 'Developing', range: [600, 649], position: 55 },
        { label: 'Intermediate', range: [650, 699], position: 63.5 },
        { label: 'Advanced', range: [700, 749], position: 75 },
        { label: 'Expert', range: [750, 799], position: 86 },
        { label: 'Exceptional', range: [800, 850], position: 92 }
    ];

    return (
        <Box>
            <CardContent sx={{ p: 0 }}>
                {score ? (
                    <Grid container spacing={0} alignItems="center" display={'flex'} size={12}>
                        <Grid size={12} md={2} className='p-0' >
                            <Box sx={{
                                position: 'relative',
                                width: 180,
                                height: 180,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                mx: '0'
                            }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="85%"
                                        outerRadius="100%"
                                        // startAngle={90}    // Start from top (90°)
                                        // endAngle={450}     // End at top after full circle (90° + 360° = 450°)
                                        startAngle={90}    // Start from top
                                        endAngle={-270}
                                        data={radialData}
                                    >
                                        <PolarAngleAxis
                                            type="number"
                                            domain={[0, 100]}
                                            angleAxisId={0}
                                            tick={false}
                                        />
                                        <RadialBar
                                            background={{ fill: '#F3F4F6' }}
                                            dataKey="value"
                                            cornerRadius={10}
                                            fill={category.color}
                                        // clockWise={true}
                                        />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        fontWeight={500}
                                        color="text.primary"
                                        sx={{ fontSize: '2.5rem', lineHeight: 1, mb: 1 }}
                                    >
                                        {score}
                                    </Typography>
                                    <Chip
                                        label={category.label}
                                        sx={{
                                            backgroundColor: category.color,
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            height: 28,
                                            px: 0,
                                            borderRadius: 6
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid md={10} padding={0} className='p-0' sx={{
                            width: 'calc(100% - 220px)'
                        }}>
                            <Box sx={{ py: 3, px: 2, borderWidth: 1, borderStyle: 'solid', borderColor: '#C9C9C9', borderRadius: '20px', }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="#6D6D6D" fontWeight={600}>
                                        300
                                    </Typography>
                                    <Typography variant="body2" color="#6D6D6D" fontWeight={600}>
                                        850
                                    </Typography>
                                </Box>

                                <Box sx={{ position: 'relative' }}>
                                    <Box sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        background: 'linear-gradient(to right, #dc2626 0%, #dc2626 45.27%, #ef4444 45.27%, #ef4444 54.36%, #f97316 54.36%, #f97316 63.45%, #f59e0b 63.45%, #f59e0b 72.54%, #8b5cf6 72.54%, #8b5cf6 81.63%, #3b82f6 81.63%, #3b82f6 90.72%, #10b981 90.72%, #10b981 100%)',
                                        position: 'relative'
                                    }} />

                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: `${scorePosition}%`,
                                            top: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: 16,
                                            height: 16,
                                            backgroundColor: 'white',
                                            border: `3px solid ${category.color}`,
                                            borderRadius: '50%',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            zIndex: 2
                                        }}
                                    />
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    mt: 1.5,
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    height: 20
                                }}>
                                    {categories.map((cat, index) => (
                                        <Typography
                                            key={cat.label}
                                            variant="caption"
                                            sx={{
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                color: '#6D6D6D',
                                                position: 'absolute',
                                                left: `${cat.position}%`,
                                                // transform: 'translateX(-50%)',
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {cat.label}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        No Trading Score Available
                    </Typography>
                )}
            </CardContent>
        </Box>
    )
}