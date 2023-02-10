import { GithubUser } from "./GithubUser.js"

/*
Classe que vai conter a logica dos dados
*/
export class Favorites {
    //método construtor receberá a classe que será manipulada
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    //Salvando arquivo no formato de JSON no LocalStorage
    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username){
        
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists){
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)

            if (user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }

            //Operador SPREAD 
            //Faz os espalhamento insercão de todos os outros usuários do array ali
            //para o array passamos o novo usuário inserido e também os antigos com o spread
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error){
            alert(error.message)
        }
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
        this.save()
    }

}

/*
criar a visualizacao dos eventos em HTML
*/
export class FavoritesView extends Favorites {
    constructor(root){
        super(root) //classe filha com o super() chama o construtor da classe pai

        this.tbody = this.root.querySelector('table tbody')
        
        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)
        }
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


