@extends("layouts.app")

@section("content")

    <div class="container w-75">

        @if(session('info'))
        <script type="module">
            import {Eggy} from "/js/eggy.js";
            Eggy({
                title: "",
                message: '{{ session('info') }}',
                type: 'info'
            })
        </script>
        @elseif(session('error'))
        <script type="module">
            import {Eggy} from "/js/eggy.js";
            Eggy({
                title: "",
                message: '{{ session('error') }}',
                type: 'error'
            })
        </script>
        @elseif($errors->any())
            @foreach($errors->all() as $error)
            <script type="module">
                import {Eggy} from "/js/eggy.js";
                Eggy({
                    title: "",
                    message: '{{ $error }}',
                    type: 'info'
                })
            </script>
            @endforeach
        @endif

        <div class="card mb-2">
            <div class="card-body">
                <h5 class="card-title">{{ $article->title }}</h5>
                <div class="card-subtitle mb-2 text-muted small">
                    by: <b class="text-success"> {{ $article->user->name }}, </b>
                    Category: <b class="text-success">{{ $article->category->name }}, 
                    </b>{{ $article->created_at->diffForHumans() }}
                </div>
                <p class="card-text">{{ $article->body }}</p>
                @can('edit-article', $article)
                <a href="{{ url("/articles/edit/$article->id") }}" class="btn btn-info">Edit</a>
                @endcan
                <a href="{{ url("/articles/delete/$article->id") }}" class="btn btn-danger">Delete</a>
            </div>
        </div>
        <ul class="list-group">
            <li class="list-group-item active">
                <b>Comments ({{ count($article->comments) }})</b>
            </li>
            @foreach($article->comments as $comment)   
            <li class="list-group-item">
                <a href="{{ url("/comments/delete/$comment->id") }}" class="btn-close float-end"></a>
                <div class="card-subtitle mb-2">
                    <b class="text-success">{{ $comment->user->name }},</b>
                    <small class="text-muted"> {{ $comment->created_at->diffForHumans() }}</small>
                </div>
                {{ $comment->content }}
            </li>
            @endforeach
        </ul> 
        
        @auth
        <form action="{{ url('/comments/add') }}" method="post">
            @csrf
            <input type="hidden" name="article_id" value="{{ $article->id }}">
            <textarea name="content" class="form-control mb-2" placeholder=" New Comment"></textarea>
            <input type="submit" value="Add Comment" class="btn btn-secondary">
        </form>
        @endauth
    </div>
@endsection