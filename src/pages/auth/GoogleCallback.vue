<template>
    <div class="processing">
        <p>Processing Google login...</p>
    </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { handleGoogleCallback } from '@/api/modules/auth.api';
import { addRoleRoutes } from '@/router';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    try {
        const params = {
            code: route.query.code,
            state: route.query.state || null,
        };
        const resp = await handleGoogleCallback(params);

        localStorage.setItem('token', resp.access_token);
        localStorage.setItem('user', JSON.stringify({
            id: resp.id,
            name: resp.name,
            role: resp.role,
            email: resp.email,
            image: resp.image
        }));

        if (resp.status === 'rejected') {
            await nextTick()
            router.push('/denied')
            return
        }

        if (resp.status === 'pending') {
            await nextTick()
            router.push('/waiting')
            return
        }

        addRoleRoutes(resp.role);
        await nextTick()
        router.push('/courses');
    } catch (error) {
        console.error('Google login failed:', error);
    }
});
</script>