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
        @endif
        
        @foreach($articles as $article)
        <div class="card mb-2">
            <div class="card-body">
                <h5 class="card-title">{{ $article->title }}</h5>
                <div class="card-subtitle mb-2 text-muted small">
                    by: <b class="text-success"> {{ $article->user->name }}, </b>
                    Category: <b class="text-success"> {{ $article->category->name }}, </b>
                    Comments: <b class="text-success"> ({{ count($article->comments) }}), </b>
                    {{ $article->created_at->diffForHumans() }}
                </div>
                <p class="card-text">{{ $article->body }}</p>
                <a href="{{ url("/articles/detail/$article->id") }}" class="card-link">Detail &raquo;</a>
            </div>
        </div>
        @endforeach
        
        {{ $articles->links() }}

    </div>
@endsection