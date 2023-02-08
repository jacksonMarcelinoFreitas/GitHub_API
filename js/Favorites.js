export class GithubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json)
        .then(({login, name, public_repos, followers}) => ({
            login,
            name, 
            public_repos,
            followers
        }))
        
    }

}

/*
Classe que vai conter a logica dos dados
*/
export class Favorites {
    //método construtor receberá a classe que será manipulada
    constructor(root) {
        this.root = document.querySelector(root)
        this.tbody = this.root.querySelector('table tbody')
        this.load()

        GithubUser.search('maykbrito').then(user => console.log(user))
    }

    load(){
    this.entries = [   
            {
                login: 'maykbrito',
                name: "Maik Brito",
                public_repos: '76',
                followers: 120000
            },
            {
                login: 'diego3g',
                name: "Diego Fernandes",
                public_repos: '98',
                followers: 890
            }
        ]
    }

    delete(user){
        /* Principio da Imutabilidade
        - Funçoes como filter, map ...
        - trabalham gerando novos dados já manipulados
        - permitem que a informaçao original se mantenha
        */
        //Higher order functions(map - filter - find - reduce)
        //A funcao filter valida coondicoes booleanas
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
    }

}

/*
criar a visualizacao e eventos em HTML
*/
export class FavoritesView extends Favorites {
    constructor(root){
        super(root) //classe filha com o super() chama o construtor da classe pai
        this.update()

        
    }

    update(){
        //o this faz referencia ao alemento da própria classe
        this.removeAllTr()

        //percorre cada user criando seu HTML 
        this.entries.forEach(user => {
            const row = this.createRow()
            
            //adiciona ao tr os valores do array
            row.querySelector('.user img').src =  `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name 
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            this.tbody.append(row)
            //selecao do botao de remover aciona funcao de delete
            row.querySelector('.remove').onclick = ()=> {
                const isOk = confirm("Tem certeza que deseja deletar esta linha?")
                if(isOk){
                    this.delete(user)
                } 
            }

        })

    }



    createRow(){
        //criando elemento pelo JS
        const tr = document.createElement('tr')
        //tr sendo criado com a DOM
        const content = `
            <td class="user">
                <img src="https://github.com/.png" alt="Imagem de ">
                <a href="https://github.com/" target="_blank">
                    <p></p>
                    <span></span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `
        tr.innerHTML = content

        return tr
    }

    removeAllTr(){
        //vai retornar um nodeList com propriedades de array
        //apesar de não ser um array, pode ser iterado como um, com foreach
        this.tbody.querySelectorAll('tr').forEach((tr) => { 
            tr.remove()
        });

    }

}


