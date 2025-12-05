import { db } from '@/db';
import { payments } from '@/db/schema';

async function main() {
    const samplePayments = [
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            evaluationId: 1,
            amount: 9.99,
            currency: 'USD',
            status: 'completed',
            stripePaymentId: 'pi_3NvK8jL2mF9xPq4H0Xyz12Ab',
            createdAt: new Date('2024-12-05T10:30:00Z').toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            evaluationId: 3,
            amount: 14.99,
            currency: 'USD',
            status: 'completed',
            stripePaymentId: 'ch_3NvK9pL2mF9xPq4H1Def34Cd',
            createdAt: new Date('2024-12-12T14:45:00Z').toISOString(),
        },
        {
            userId: 'user_02k5myt3f9a1z4c2o8n7r6x9s5',
            evaluationId: 4,
            amount: 9.99,
            currency: 'EUR',
            status: 'completed',
            stripePaymentId: 'pi_3NvKBrL2mF9xPq4H2Ghi56Ef',
            createdAt: new Date('2024-12-18T09:15:00Z').toISOString(),
        },
        {
            userId: 'user_02k5myt3f9a1z4c2o8n7r6x9s5',
            evaluationId: 6,
            amount: 9.99,
            currency: 'USD',
            status: 'pending',
            stripePaymentId: 'pi_3NvKDtL2mF9xPq4H3Jkl78Gh',
            createdAt: new Date('2024-12-20T16:20:00Z').toISOString(),
        },
    ];

    await db.insert(payments).values(samplePayments);
    
    console.log('✅ Payments seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});