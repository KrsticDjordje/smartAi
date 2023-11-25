export default {
    methods: {
        notify(message, type = 'default') {
            this.$toast(message, {
                type: type,
                // Ovde možete dodati još stilova ili opcija
            });
        }
    }
};