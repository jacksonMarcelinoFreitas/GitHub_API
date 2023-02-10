export class GithubUser {
    //um método estático pode ser chamado sem ter a classe extendida
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint) //transformar em json
        .then(data => data.json()) //retonar um objeto desestruturado
        .then(({login, name, public_repos, followers}) => ({
            login,
            name, 
            public_repos,
            followers
        }))
        
    }

}

