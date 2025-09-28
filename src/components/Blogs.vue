<script setup>
defineProps({
    // 
});
</script>

<template>
    <div>
        # create a template for multiple blog posts
        <div v-for="post in posts" :key="post.id">
            <h2>{{ post.title }}</h2>
            <p>{{ post.body }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            posts: [
                { id: 1, title: 'Post 1', body: 'This is the first post' },
                { id: 2, title: 'Post 2', body: 'This is the second post' },
                // Add more posts as needed...
            ],
        };
    },
    //
}
</script>