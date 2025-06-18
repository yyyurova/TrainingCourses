<template>
    <div class="processing">
        <p>Processing Google login...</p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { handleGoogleCallback } from '@/api/modules/auth.api';
import { addRoleRoutes } from '@/router';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    try {
        const code = route.query.code;
        const state = route.query.state;

        if (!code || !state) {
            throw new Error('Authorization code missing');
        }

        const response = await handleGoogleCallback(code, state);
        localStorage.setItem('token', response.access_token);

        localStorage.setItem('user', JSON.stringify({
            id: response.id,
            name: response.name,
            role: response.role,
            email: response.email,
            image: response.image
        }));
        if (resp.data.data.status === 'rejected') {
            // await nextTick()
            router.push('/denied')
            return
        }
        if (resp.data.data.status === 'pending') {
            // await nextTick()
            router.push('/waiting')
            return
        }
        addRoleRoutes(resp.data.data.role);
        // await nextTick()
        router.push('/courses');

    } catch (error) {
        console.error('Google login failed:', error);
        router.push('/signin?google_error=1');
    }
});
</script>